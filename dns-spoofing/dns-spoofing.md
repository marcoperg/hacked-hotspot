# DNS Spoofing

This requires to have the hotspot up and running

## Kill previous

```
sudo killall -9 dnsmasq
```

## Fill fakehosts.txt

Fill `fakehosts.txt` with the desire domains and ip to spoof, with this format:

```
192.168.25.101 www.example.com example.com
192.168.25.100 www.example2.com example2.com
```

### WildCard Host

For creating a wildcard that will contain all subdomain of the hosts add the following line to `dnsmasq.conf` file, where `.gal` is the top domain to add:

```
address=/.gal/192.168.4.1
```

## Run dnsmasq

```
sudo dnsmasq -C /etc/dnsmasq.conf -H fakehosts.txt -d
```

The `-d` option stands for `--no-daemon` and can be remove to run the command in the background

[Source](https://www.linux.com/topic/networking/dns-spoofing-dnsmasq/)
