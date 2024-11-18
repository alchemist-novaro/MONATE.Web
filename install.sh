cd ./MONATE.Web.Server
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
sudo apt-get install -y dotnet-runtime-8.0
sudo apt-get install -y aspnetcore-runtime-8.0
dotnet restore

cd ./monate.web.client
npm install