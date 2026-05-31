import json
path = 'notebooks/churn_model_training.ipynb'
with open(path, 'r', encoding='utf-8-sig') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell.get('cell_type') == 'code':
        cell['source'] = [l.replace("os.path.abspath('..')", "os.path.abspath('../ml')") for l in cell['source']]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)
