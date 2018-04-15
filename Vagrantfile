# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/xenial64"
  config.vm.provision "shell", path: "vagrant-provision.sh"

  if Vagrant.has_plugin?("vagrant-cachier")
    # Configure cached packages to be shared between instances of the same base box.
    # More info on http://fgrehm.viewdocs.io/vagrant-cachier/usage
    config.cache.scope = :box
  end

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 1
    vb.customize [ "modifyvm", :id, "--uartmode1", "disconnected" ] # Disable logging
  end

  # Create a forwarded port mapping which allows access to a specific port
  config.vm.network "forwarded_port", guest: 80, host: 8040 # Web Server
  config.vm.network :private_network, ip: "192.168.68.90"

  # This shares the folder and sets very liberal permissions
  config.vm.synced_folder ".", "/vagrant/",
  	id: "site",
  	:nfs => true

  # Set bash
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

end
