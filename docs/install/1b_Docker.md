# Installation using AWS lightsail - Docker

### 📚 Index

<!-- toc -->

- [📦️ Instance setup](#%F0%9F%93%A6%EF%B8%8F-instance-setup)
- [🔒️ SSH access](#%F0%9F%94%92%EF%B8%8F-ssh-access)
- [🚀 Install and configure app](#%F0%9F%9A%80-install-and-configure-app)
- [💄 Optional steps](#%F0%9F%92%84-optional-steps)

<!-- tocstop -->

### 📦️ Instance setup

- Create a [AWS lightsail](https://lightsail.aws.amazon.com/) account

- Deploy an VPS instance
  - Go to [AWS lightsail > Intances](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
  - Select [Create instance](https://lightsail.aws.amazon.com/ls/webapp/create/instance)
  - Select Linux/Unix > OS > __Ubuntu__
  - Name it like you want
  - Validate creation

- Add a static IP
  - Go to [AWS lightsail > Networking](https://lightsail.aws.amazon.com/ls/webapp/home/networking)
  - Select [Create static IP](https://lightsail.aws.amazon.com/ls/webapp/create/static-ip)
  - Attach it to your instance
  - Name it like you want
  - Validate creation

### 🔒️ SSH access

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

- Refresh packages and install updates :

    ```sh
    sudo apt update -y && sudo apt upgrade -y
    ```

- Install Docker and Docker-compose :

    ```sh
    sudo apt install -y docker.io
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    ```

- Download and run the app :

    ```sh
    curl https://raw.githubusercontent.com/thibaultyou/tradingview-alerts-processor/master/docker-compose.yml
    sudo docker-compose up -d
    ```

### 💄 Optional steps

>
> For those steps you need to be logged in your instance, see the first command in [Step 3 - Install and configure app](#%F0%9F%9A%80-install-and-configure-app)
>

- Check app logs :

    ```sh
    sudo docker-compose logs
    ```

- Update the app :

    ```sh
    sudo docker-compose pull
    sudo docker-compose up -d
    ```

- Restrict commands to Tradingview alerts system only, __once activated you'll not be able to send commands from your computer with HTTP requests, please [add your accounts](./1c_Keys.md) before using this__ :
  - Go to [AWS lightsail > Networking](https://lightsail.aws.amazon.com/ls/webapp/home/networking)
  - Add a filter rule on TCP port 80
  - Check restrict to IP
  - Add the following :
    - 52.89.214.238
    - 34.212.75.30
    - 54.218.53.128
    - 52.32.178.7