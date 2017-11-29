#!/usr/bin/env bash
#
# vagrant-provision.sh
#
# This file is specified in Vagrantfile and is loaded by Vagrant as the primary
# provisioning script whenever the commands `vagrant up`, `vagrant provision`,
# or `vagrant reload` are used.

apt-get update

# Install nginx
apt-get install -y nginx

# Install php-fpm
add-apt-repository -y ppa:ondrej/php && sudo apt-get update
apt-get install -y php7.1-cli php7.1-fpm php7.1-mysql php7.1-curl php-memcached php7.1-dev php7.1-mcrypt php7.1-sqlite3 php7.1-mbstring graphicsmagick php7.1-imagick php-xml
apt-cache search php7.1

# php.ini
sed -i.bak 's/^;cgi.fix_pathinfo.*$/cgi.fix_pathinfo = 1/g' /etc/php/7.1/fpm/php.ini

service php7.1-fpm restart

# Configure host
cat << 'EOF' > /etc/nginx/sites-available/default
server {
	listen 80;

	server_name _;
	root /vagrant;
	index index.php index.html;
	charset utf-8;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	# 404 error handler
	error_page 404 /index.php?$query_string;

	# Don't hint these as folders
	rewrite ^/(content|site|kirby)$ /error last;

	# block content
	rewrite ^/content/(.*).(txt|md|mdown)$ /error last;

	# block all files in the site and kirby folder from being accessed directly
	rewrite ^/(site|kirby)/(.*)$ /error last;

	# site links
	location / {
	    try_files $uri $uri/ /index.php?$uri&$args;
	}

	# panel links
	location /panel {
	    try_files $uri $uri/ /panel/index.php?$uri&$args;
	}

	# php-fpm configuration
	location ~ [^/]\.php(/|$) {
		try_files $uri $uri/ /index.php?$query_string;
		fastcgi_split_path_info ^(.+\.php)(/.+)$;
		fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
		fastcgi_index index.php;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		fastcgi_param PATH_INFO $fastcgi_path_info;
		fastcgi_param HTTP_PROXY "";

		fastcgi_intercept_errors off;
		fastcgi_buffer_size 16k;
		fastcgi_buffers 4 16k;
		fastcgi_connect_timeout 300;
		fastcgi_send_timeout 300;
		fastcgi_read_timeout 300;
	}

	# Disable reading of Apache .htaccess files
	location ~ /\.ht {
	    deny all;
	}

	# Misc settings
	sendfile off;
	client_max_body_size 100m;
}
EOF

# Restart services
service nginx restart
service php7.1-fpm restart
