from fastapi import FastAPI

app = FastAPI(title="Test Todo API")

@app.get("/")
def read_root():
    return {"message": "Test server is working"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}