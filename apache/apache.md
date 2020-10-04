# APACHE SERVER TO DEPLOY WEB

## Apache installation

```
sudo apt install apache2
```

## Secure connection to use https

### Create the SSL Certificate

Create a self-signed key and certificate pair with OpenSSL:

```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
```

(CommonName: `*.com`)

Create strong Diffie-Hellman group, which is used in negotiating Perfect Forward Secrecy with clients:

```
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

### Create an Apache Configuration Snippet with Strong Encryption Settings

Create a new snippet in the `/etc/apache2/conf-available` directory. We will name the file `ssl-params.conf` to make its purpose clear:

```
sudo nano /etc/apache2/conf-available/ssl-params.conf
```

To set up Apache SSL securely, we will be using the recommendations by [Remy van Elst](https://raymii.org/s/static/About.html) on the [Cipherli.st](https://cipherli.st/) site. This site is designed to provide easy-to-consume encryption settings for popular software. You can read more about his decisions regarding the Apache choices [here](https://raymii.org/s/tutorials/Strong_SSL_Security_On_Apache2.html).

```
# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_Apache2.html

SSLCipherSuite EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH
SSLProtocol All -SSLv2 -SSLv3
SSLHonorCipherOrder On
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the "preload" directive if you understand the implications.
#Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains; preload"
Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains"
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
# Requires Apache >= 2.4
SSLCompression off
SSLSessionTickets Off
SSLUseStapling on
SSLStaplingCache "shmcb:logs/stapling-cache(150000)"

SSLOpenSSLConfCmd DHParameters "/etc/ssl/certs/dhparam.pem"
```

### Modify the Default Apache SSL Virtual Host File

Next, let’s modify `/etc/apache2/sites-available/default-ssl.conf`, the default Apache SSL Virtual Host file.

Before we go any further, let’s back up the original SSL Virtual Host file:

```
sudo mv /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf.bak
```

Now, open the SSL Virtual Host file to make adjustments:

```
sudo nano /etc/apache2/sites-available/default-ssl.conf
```

And fill it with:

```
<IfModule mod_ssl.c>
        <VirtualHost _default_:443>
                ServerAdmin your_email@example.com
                ServerName server_domain_or_IP

                DocumentRoot /var/www/html

                ErrorLog ${APACHE_LOG_DIR}/error.log
                CustomLog ${APACHE_LOG_DIR}/access.log combined

                SSLEngine on

                SSLCertificateFile      /etc/ssl/certs/apache-selfsigned.crt
                SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key

                <FilesMatch "\.(cgi|shtml|phtml|php)$">
                                SSLOptions +StdEnvVars
                </FilesMatch>
                <Directory /usr/lib/cgi-bin>
                                SSLOptions +StdEnvVars
                </Directory>

                BrowserMatch "MSIE [2-6]" \
                               nokeepalive ssl-unclean-shutdown \
                               downgrade-1.0 force-response-1.0

        </VirtualHost>
</IfModule>
```

### (Not for this purpose) Modify the Unencrypted Virtual Host File to Redirect to HTTPS

As it stands now, the server will provide both unencrypted HTTP and encrypted HTTPS traffic. For better security, it is recommended in most cases to redirect HTTP to HTTPS automatically. If you do not want or need this functionality, you can safely skip this section.

To adjust the unencrypted Virtual Host file to redirect all traffic to be SSL encrypted, we can open the `/etc/apache2/sites-available/000-default.conf` file:

```
sudo nano /etc/apache2/sites-available/000-default.conf
```

Inside, within the `VirtualHost` configuration blocks, we just need to add a `Redirect` directive, pointing all traffic to the SSL version of the site:

```
<VirtualHost \*:80>
. . .

        Redirect permanent "/" "https://your_domain_or_IP/"

        . . .

</VirtualHost>
```

### Enable the Changes in Apache

We can enable mod_ssl, the Apache SSL module, and mod_headers, needed by some of the settings in our SSL snippet, with the a2enmod command:

```
sudo a2enmod ssl
sudo a2enmod headers
```

Next, we can enable our SSL Virtual Host with the a2ensite command:

```
sudo a2ensite default-ssl
```

We will also need to enable our ssl-params.conf file, to read in the values we set:

```
sudo a2enconf ssl-params
```

At this point, our site and the necessary modules are enabled. We should check to make sure that there are no syntax errors in our files. We can do this by typing:

```
sudo apache2ctl configtest
```

If everything is successful, you will get a result that looks like this:

```
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 127.0.1.1. Set the 'ServerName' directive globally to suppress this message
Syntax OK
```

If your output has Syntax OK in it, your configuration file has no syntax errors. We can safely restart Apache to implement our changes:

```
sudo systemctl restart apache2
```

[Source](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04#step-4-enable-the-changes-in-apache)
