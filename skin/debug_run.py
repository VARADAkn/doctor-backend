import subprocess
import sys
import os

# Change directory to the root of the skin folder
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("Starting training script...")
# Run the training script directly as a subprocess to avoid any weirdness with exec
result = subprocess.run([sys.executable, "Src/Model Training/train_local_ham10000.py"], capture_output=False)
sys.exit(result.returncode)
