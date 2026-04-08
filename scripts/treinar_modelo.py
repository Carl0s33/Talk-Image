import argparse
import json
import os
from pathlib import Path

try:
    import numpy as np  # type: ignore
except ImportError:  # pragma: no cover
    np = None

try:
    import tensorflow as tf  # type: ignore
except ImportError:  # pragma: no cover
    tf = None


def _flatten_hand(hand):
    out = []
    for p in hand:
        out.extend([float(p.get("x", 0.0)), float(p.get("y", 0.0)), float(p.get("z", 0.0))])
    if len(out) != 63:
        out = (out + [0.0] * 63)[:63]
    return out


def _frame_to_features(frame_hands, feature_dim):
    if feature_dim == 63:
        if not frame_hands:
            return [0.0] * 63
        return _flatten_hand(frame_hands[0])

    if feature_dim == 126:
        if not frame_hands:
            return [0.0] * 126

        if len(frame_hands) == 1:
            return _flatten_hand(frame_hands[0]) + ([0.0] * 63)

        h0 = frame_hands[0]
        h1 = frame_hands[1]
        x0 = float(h0[0].get("x", 0.0)) if h0 else 0.0
        x1 = float(h1[0].get("x", 0.0)) if h1 else 0.0
        left = h0 if x0 <= x1 else h1
        right = h1 if x0 <= x1 else h0
        return _flatten_hand(left) + _flatten_hand(right)

    raise ValueError(f"feature_dim inválido: {feature_dim}")


def load_dataset(dataset_dir: Path, classes, window: int, stride: int, feature_dim: int):
    X = []
    y = []

    label_to_idx = {c: i for i, c in enumerate(classes)}

    for label in classes:
        folder = dataset_dir / label
        if not folder.exists():
            continue
        for file in sorted(folder.glob("*.json")):
            try:
                obj = json.loads(file.read_text(encoding="utf-8"))
            except Exception:
                continue

            seq_features = None
            if feature_dim == 126 and isinstance(obj.get("sequencia_126"), list):
                seq_features = obj.get("sequencia_126")
            elif isinstance(obj.get("sequencia_lr"), list):
                seq_features = obj.get("sequencia_lr")
            else:
                seq_features = obj.get("sequencia")

            if not isinstance(seq_features, list) or len(seq_features) < window:
                continue

            frames = []
            if feature_dim in (63, 126) and seq_features is obj.get("sequencia_126"):
                for frame in seq_features:
                    if not isinstance(frame, list) or len(frame) != 126:
                        frames.append([0.0] * 126)
                        continue
                    frames.append([float(x) for x in frame])
            else:
                for frame in seq_features:
                    if not isinstance(frame, list):
                        frames.append([0.0] * feature_dim)
                        continue
                    feats = _frame_to_features(frame, feature_dim)
                    frames.append(feats)

            for start in range(0, len(frames) - window + 1, stride):
                chunk = frames[start : start + window]
                X.append(chunk)
                y.append(label_to_idx[label])

    if not X:
        raise RuntimeError("Nenhuma amostra encontrada. Verifique o caminho do dataset e o formato dos JSONs.")

    X = np.asarray(X, dtype=np.float32)
    y = np.asarray(y, dtype=np.int32)
    return X, y


def make_model(window: int, feature_dim: int, num_classes: int):
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(window, feature_dim), name="input"),
            tf.keras.layers.LSTM(64, return_sequences=True, activation="relu"),
            tf.keras.layers.LSTM(128, activation="relu"),
            tf.keras.layers.Dense(64, activation="relu"),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(num_classes, activation="softmax"),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"],
    )
    return model


def split_train_val(X, y, val_ratio: float, seed: int):
    rng = np.random.default_rng(seed)
    idx = np.arange(len(X))
    rng.shuffle(idx)

    n_val = int(len(X) * val_ratio)
    val_idx = idx[:n_val]
    train_idx = idx[n_val:]

    return X[train_idx], y[train_idx], X[val_idx], y[val_idx]


def main():
    if np is None or tf is None:
        raise RuntimeError(
            "Dependências faltando. Instale: pip install numpy tensorflow (no Colab: pip install tensorflow numpy)."
        )

    ap = argparse.ArgumentParser()
    ap.add_argument("--dataset", type=str, default="dataset")
    ap.add_argument("--window", type=int, default=30)
    ap.add_argument("--stride", type=int, default=5)
    ap.add_argument("--feature-dim", type=int, default=63, choices=[63, 126])
    ap.add_argument("--epochs", type=int, default=25)
    ap.add_argument("--batch", type=int, default=32)
    ap.add_argument("--val", type=float, default=0.2)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--out", type=str, default="treino_saida")
    args = ap.parse_args()

    classes = ["bom_dia", "oi", "obrigado", "outros"]

    dataset_dir = Path(args.dataset)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    X, y = load_dataset(dataset_dir, classes, args.window, args.stride, args.feature_dim)
    X_train, y_train, X_val, y_val = split_train_val(X, y, args.val, args.seed)

    model = make_model(args.window, args.feature_dim, len(classes))

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=5, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(str(out_dir / "best.keras"), monitor="val_accuracy", save_best_only=True),
    ]

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=args.epochs,
        batch_size=args.batch,
        callbacks=callbacks,
        verbose=1,
    )

    model.save(out_dir / "model.keras")

    try:
        import tensorflowjs as tfjs  # type: ignore

        tfjs_dir = out_dir / "tfjs_model"
        if tfjs_dir.exists():
            for root, dirs, files in os.walk(tfjs_dir, topdown=False):
                for name in files:
                    Path(root, name).unlink(missing_ok=True)
                for name in dirs:
                    Path(root, name).rmdir()
        tfjs_dir.mkdir(parents=True, exist_ok=True)

        tfjs.converters.save_keras_model(model, str(tfjs_dir))
        print(f"TFJS exportado em: {tfjs_dir}")
    except Exception as e:
        print("Não exportei para TFJS (tensorflowjs não instalado ou falhou):", e)

    print("Treino finalizado.")
    print("Classes (ordem):", classes)
    print("Amostras total:", len(X), "| treino:", len(X_train), "| val:", len(X_val))
    print("feature_dim:", args.feature_dim)


if __name__ == "__main__":
    main()
