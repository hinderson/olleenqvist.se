# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    # Box
    config.vm.box = "precise64"
    config.vm.box_url = "http://files.vagrantup.com/precise64.box"

    # Forwarded Ports
    config.vm.network :forwarded_port, guest: 80, host: 8080
    config.vm.network :private_network, ip: "192.168.68.10"

    # Shared Folders
    config.vm.synced_folder "./", "/vagrant",
    owner: "vagrant",
    group: "www-data",
    mount_options: ["dmode=775,fmode=664"]

    # Provisioning
    config.vm.provision :shell, :inline => "apt-get update --fix-missing"
    config.vm.provision :shell, :inline => "apt-get install -q -y python-software-properties python"
    config.vm.provision :shell, :inline => "add-apt-repository ppa:ondrej/php5 && apt-get update"
    config.vm.provision :shell, :inline => "apt-get install -qy nginx php5-common php5-dev php5-cli php5-fpm curl php5-curl php5-gd php5-mcrypt php5-mysql"
    config.vm.provision :shell, :inline => "sudo cp /vagrant/.provision/nginx/nginx.conf /etc/nginx/sites-available/site.conf"
    config.vm.provision :shell, :inline => "sudo chmod 644 /etc/nginx/sites-available/site.conf"
    config.vm.provision :shell, :inline => "sudo ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/site.conf"
    config.vm.provision :shell, :inline => "service nginx restart"

    # Change nginx Working Directory
    config.vm.provision :shell, :inline => "rm -rf /var/www"
    config.vm.provision :shell, :inline => "ln -fs /vagrant /var/www"
end
