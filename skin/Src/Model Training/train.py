import os
import sys
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
import albumentations as A
import cv2
from tqdm import tqdm
from ImageDataAugmentor.image_data_augmentor import ImageDataAugmentor

# Import local modules
import utils
import pre_train
from model_param import model_parameter

def get_tf_dataset(df, transform, batch_size, classes, image_size, shuffle=False):
    def load_and_augment(path, label):
        def py_func(path, label):
            path_str = path.numpy().decode('utf-8')
            # Load image
            image = cv2.imread(path_str)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Apply Albumentations
            if transform:
                image = transform(image=image)['image']
            
            return image.astype('float32'), label.numpy().astype('float32')

        img, lbl = tf.py_function(py_func, [path, label], [tf.float32, tf.float32])
        img.set_shape((image_size, image_size, 3))
        lbl.set_shape((len(classes),))
        return img, lbl

    paths = df['image'].values
    one_hot_labels = pd.get_dummies(df['diagnosis']).reindex(columns=classes, fill_value=0).values.astype('float32')
    
    dataset = tf.data.Dataset.from_tensor_slices((paths, one_hot_labels))
    if shuffle:
        dataset = dataset.shuffle(buffer_size=1024)
    
    dataset = dataset.map(load_and_augment, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(tf.data.AUTOTUNE)
    return dataset

if __name__ == '__main__':
    print("\n" + "="*50)
    print("   OPTIMIZED LOCAL HAM10000 TRAINING")
    print("="*50 + "\n")
    
    # 1. Load Model Parameters
    model_config = 'model_tiny'
    selected_model = model_parameter(model_config)
    
    # 2. Define Local Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATASET_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "dataset"))
    METADATA_PATH = os.path.join(DATASET_ROOT, "HAM10000_metadata.csv")
    IMAGE_DIRS = [
        os.path.join(DATASET_ROOT, "HAM10000_images_part_1"),
        os.path.join(DATASET_ROOT, "HAM10000_images_part_2")
    ]
    SAVE_DIR = os.path.join(BASE_DIR, "saveModel", "Model_Tiny")
    RUNS_DIR = os.path.join(BASE_DIR, "runs")

    os.makedirs(SAVE_DIR, exist_ok=True)
    os.makedirs(RUNS_DIR, exist_ok=True)
    
    # 3. Load Metadata
    if not os.path.exists(METADATA_PATH):
        print(f"Error: Metadata file not found at {METADATA_PATH}")
        sys.exit(1)
        
    df = pd.read_csv(METADATA_PATH)
    
    # 4. Map Image Paths
    image_path_map = {}
    for folder in IMAGE_DIRS:
        if os.path.exists(folder):
            for img_file in os.listdir(folder):
                if img_file.endswith(".jpg"):
                    image_id = img_file.replace(".jpg", "")
                    image_path_map[image_id] = os.path.join(folder, img_file)
    
    df['image'] = df['image_id'].apply(lambda x: image_path_map.get(x, None))
    df = df[df['image'].notna()].copy()
    
    # 5. Map Classes
    class_map = {
        'akiec': 'AK', 'bcc': 'BCC', 'bkl': 'BKL', 'df': 'DF', 'mel': 'MEL', 'nv': 'NV', 'vasc': 'VASC'
    }
    df['diagnosis'] = df['dx'].map(class_map)
    APP_CLASSES = ['AK', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'SCC', 'UNK', 'VASC']
    
    # 6. Initialize Model
    image_resize = (selected_model['resize'], selected_model['resize'])
    image_shape = image_resize + (3, )
    
    model = pre_train.EffNet(
        input_size=image_shape, 
        num_classess=len(APP_CLASSES),
        pretrained_model=selected_model['backbone'],
        lr_rate=selected_model['initial_lr']
    )
    
    # 7. Split and Weights
    train_df, val_df = train_test_split(df, test_size=0.15, random_state=42, stratify=df['diagnosis'])
    
    classes_in_train = np.unique(train_df['diagnosis'])
    weights = compute_class_weight('balanced', classes=classes_in_train, y=train_df['diagnosis'])
    class_weight_dict = {i: 1.0 for i in range(len(APP_CLASSES))}
    for cl, w in zip(classes_in_train, weights):
        idx = APP_CLASSES.index(cl)
        class_weight_dict[int(idx)] = float(w)
    
    print(f"Class Weights: {class_weight_dict}")

    # 8. Setup Datasets
    transform_train, transform_val, _ = pre_train.augment_images(selected_model['resize'])
    
    train_ds = get_tf_dataset(train_df, transform_train, selected_model['train_batch_size'], APP_CLASSES, selected_model['resize'], shuffle=True)
    val_ds = get_tf_dataset(val_df, transform_val, selected_model['validation_batch_size'], APP_CLASSES, selected_model['resize'])
    
    # 9. Training
    epochs = 15
    model.fit(
        train_ds,
        epochs=epochs,
        validation_data=val_ds,
        class_weight=class_weight_dict,
        callbacks=[
            tf.keras.callbacks.ModelCheckpoint(
                os.path.join(SAVE_DIR, "final_model.keras"), 
                save_best_only=True, monitor='val_accuracy'
            ),
            tf.keras.callbacks.CSVLogger(os.path.join(RUNS_DIR, "ham10000_training_log.csv")),
            tf.keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True),
            tf.keras.callbacks.ReduceLROnPlateau(monitor='val_accuracy', factor=0.5, patience=3, min_lr=1e-6)
        ]
    )
    
    print("\nTraining Complete. Model saved to:", os.path.join(SAVE_DIR, "final_model.keras"))
