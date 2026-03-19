import tensorflow as tf
import json
import os

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.efficientnet import EfficientNetB0, preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, BatchNormalization, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

# =========================
# SETTINGS
# =========================

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 40

train_dir = "dataset2/SkinDisease/train"
test_dir = "dataset2/SkinDisease/test"

# =========================
# DATA GENERATOR
# =========================

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=25,
    zoom_range=0.2,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

test_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input
)

# Use error handling just in case dataset2 is not present yet
try:
    train = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical"
    )

    test = test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode="categorical"
    )

    # =========================
    # SAVE CLASS INDICES
    # =========================

    os.makedirs("backend", exist_ok=True)

    with open("backend/class_indices.json", "w") as f:
        json.dump(train.class_indices, f)
    print("Class indices saved")

    # =========================
    # LOAD EfficientNetB0
    # =========================

    base_model = EfficientNetB0(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )

    # Freeze most layers
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    # Fine-tune last layers
    for layer in base_model.layers[-30:]:
        layer.trainable = True

    # =========================
    # CUSTOM HEAD
    # =========================

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.5)(x)
    output = Dense(train.num_classes, activation="softmax")(x)

    model = Model(inputs=base_model.input, outputs=output)

    # =========================
    # COMPILE
    # =========================

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )

    model.summary()

    # =========================
    # CALLBACKS
    # =========================

    early_stop = EarlyStopping(
        monitor="val_loss",
        patience=6,
        restore_best_weights=True
    )

    checkpoint = ModelCheckpoint(
        "backend/model.h5",
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )

    reduce_lr = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.3,
        patience=3,
        verbose=1
    )

    # =========================
    # TRAIN
    # =========================

    history = model.fit(
        train,
        validation_data=test,
        epochs=EPOCHS,
        callbacks=[early_stop, checkpoint, reduce_lr]
    )

    print("TRAINING COMPLETED")

except Exception as e:
    print(f"Error during setup/training: {e}")
