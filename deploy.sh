cd ./monate.web.client
npm install

cd ../MONATE.Web.Server
apt-get update
apt-get install -y dotnet-sdk-8.0
apt-get install -y dotnet-runtime-8.0
apt-get install -y aspnetcore-runtime-8.0

dotnet restore
dotnet run