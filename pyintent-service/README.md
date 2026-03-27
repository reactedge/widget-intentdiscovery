## Install
```bash
mkdir intent-service
cd intent-service
mkdir app
touch app/main.py
sudo python3 -m venv venv
sudo apt install python3.8-venv
sudo python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
pip install python-dotenv
pip install requests
pip install pytest
sudo pip install fastapi uvicorn
sudo apt install python-is-python3
python --version
cd venv/bin/
cd intent-service
uvicorn app.main:app --reload
```

then open http://127.0.0.1:8000/docs

## Run Intent Service API
```bash
curl -X GET http://127.0.0.1:8000/api/health
curl -X POST http://127.0.0.1:8000/api/intent/interpret   -H "Content-Type: application/json"   -d '{"intent":"light jacket for cold runs"}'
```

## Launch Python dcker service
```bash
docker build -f docker/py_service/Dockerfile -t pyintent-service .
docker run -p 8000:8000 -v $(pwd)/pyintent-service:/app pyintent-service
```

## Test sentences
Light jacket for running in cold mornings
Something warm but not too heavy for outside
Lightweight jacket for hiking in cold windy weather
Waterproof jacket for hiking in heavy rain but still breathable
Warm insulated jacket for winter hiking but not too bulky
Something light and breathable for hot summer runs

```bash
docker run -it -v $(pwd)/intent-service:/app -w /app intent-service bash -c "pytest -s"
```

```bash
docker run -it \
-v $(pwd)/intent-service:/app -w /app intent-service bash -c "pytest tests/test_interpret.py::test_explicit_product_type -s"
```

## Empty Cache
```bash
sudo rm intent-service/.cache/*
```