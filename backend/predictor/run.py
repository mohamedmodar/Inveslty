import uvicorn

if __name__ == "__main__":
    # The app is loaded from the 'main.py' file
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 