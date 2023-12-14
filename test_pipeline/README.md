# How to test on local

## Frontend
1. You need to have the following files in a folder:
- `src` folder with js files
- `package.json` and `package-lock.json` for package installation

2. Copy `Dockerfile` and `nginx.conf` in `frontend_test/` to your folder. The following is an example of the folder structure
```
frontend/
    |- src/
    |- package.json
    |- package-lock.json
    |- Dockerfile
    |- nginx.conf
```

3. Inside your folder, run the following command.
```
docker build -t frontend .

docker run -p 8080:80 -d frontend
```
After that, accessing `127.0.0.1:8080` should see the website.