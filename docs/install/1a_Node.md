# Installation using AWS lightsail - Nodejs

### 📦️ Instance setup

- Create a [AWS lightsail](https://lightsail.aws.amazon.com/) account

- Deploy an VPS instance
  - Go to [AWS lightsail > Intances](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
  - Select [Create instance](https://lightsail.aws.amazon.com/ls/webapp/create/instance)
  - Select the closest region to your exchange : _ap-northeast-1_ for Binance and FTX
  - Select Linux/Unix > Apps + OS > __Node.js__
  - Name it like you want
  - Validate creation

- Add a static IP
  - Go to [AWS lightsail > Networking](https://lightsail.aws.amazon.com/ls/webapp/home/networking)
  - Select [Create static IP](https://lightsail.aws.amazon.com/ls/webapp/create/static-ip)
  - Attach it to your instance (if you're not seeing it wait few minutes)
  - Name it like you want
  - Validate creation

### 🔒️ SSH access (optional)

>
> If you're not confident with SSH you can open a Terminal using your browser on AWS lightsail by clicking on your instance and skip this step
>

- Create SSH key pairs
  - Go to [AWS lightsail > SSH keys](https://lightsail.aws.amazon.com/ls/webapp/account/keys)
  - Select default key
  - Download the `.pem` file (let's pretend that you saved it here `~/Downloads/key.pem`)

- Test your access
  - Open a local terminal session
  - Adjust your key rights with this :

    ```sh
    chmod 400 ~/Downloads/key.pem
    ```

- SSH to your instance using the downloaded key like this (you can find the
    username/ip by selecting your instance [here](https://lightsail.aws.amazon.com/ls/webapp/home/instances)) :

    ```sh
    ssh USERNAME@YOUR.STATIC.IP.ADDRESS -i ~/Downloads/key.pem
    ```

### 🚀 Install and configure app

>
> Your Node.js instance must be a [Bitnami one](https://aws.amazon.com/marketplace/pp/B00NNZUAKO)
>

- Open a terminal session with your instance
- Clone the app sources :

    ```sh
    git clone https://github.com/thibaultyou/tradingview-alerts-processor.git
    ```

- Install app and configure the server :

    ```sh
    cd tradingview-alerts-processor/
    sh install.node.sh
    ```

- You should see npm entry with `online` status, if this is not the case reconfigure PM2 and check again with :

    ```sh
    pm2 start npm -- start
    pm2 save
    pm2 status npm
    ```

### 💄 Optional steps

>
> For those steps you need to be logged in your instance, see the first command in [🚀 Install and configure app](#%F0%9F%9A%80-install-and-configure-app)
>

- Check app logs :

    ```sh
    pm2 logs npm
    ```

- Check trading logs :

    ```sh
    tail -f logs/trades.log
    ```

- Update the app :

    ```sh
    cd tradingview-alerts-processor/
    sh update.node.sh
    ```

- Restrict commands to Tradingview alerts system only, __once activated you'll not be able to send commands from your computer with HTTP requests, please [add your accounts](./1c_Keys.md) before using this__ :
  - Go to AWS lightsail > your instance > Networking
  - Add a filter rule on TCP port 80
  - Check restrict to IP
  - Add the following :
    - 52.89.214.238
    - 34.212.75.30
    - 54.218.53.128
    - 52.32.178.7