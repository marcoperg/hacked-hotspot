# Preparation of the hotspot

## Install drivers for realtek-rtl8812au

- Check if the linux-headers are correctly install

  ```
  apt-get install linux-headers-$(uname -r)
  ```

- Get source code from repository

  ```
  apt-get install git
  git clone https://github.com/aircrack-ng/rtl8812au
  ```

- Install using dkms
  ```
  apt-get install dkms
  cd rtl8812au
  sudo make dkms_install
  ```

In case it's need you can uninstall with

```
sudo ./dkms-remove.sh
```

[Source](https://kalitut.com/how-to-install-rtl8812au/)

## Set up the wireless access point

### Install the AP and network management software

In order to work as an access point, the Raspberry Pi needs to have the hostapd access point software package installed:

```
sudo apt install hostapd
```

Enable the wireless access point service and set it to start when your Raspberry Pi boots:

```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
```

In order to provide network management services (DNS, DHCP) to wireless clients, the Raspberry Pi needs to have the dnsmasq software package installed:

```
sudo apt install dnsmasq
```

### Define the wireless interface IP configuration

The Raspberry Pi runs a DHCP server for the wireless network; this requires static IP configuration for the wireless interface (wlan1) in the Raspberry Pi. The Raspberry Pi also acts as the router on the wireless network, and as is customary, we will give it the first IP address in the network: 192.168.4.1.

To configure the static IP address, edit the configuration file for dhcpcd with:

```
sudo nano /etc/dhcpcd.conf
```

Go to the end of the file and add the following:

```
interface wlan1
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
```

### Enable routing and IP masquerading

This section configures the Raspberry Pi to let wireless clients access computers on the main (Ethernet) network, and from there the internet. NOTE: If you wish to block wireless clients from accessing the Ethernet network and the internet, skip this section.

To enable routing, i.e. to allow traffic to flow from one network to the other in the Raspberry Pi, create a file using the following command, with the contents below:

```
sudo nano /etc/sysctl.d/routed-ap.conf
```

File contents:

```
# https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md
# Enable IPv4 routing
net.ipv4.ip_forward=1
```

Enabling routing will allow hosts from network 192.168.4.0/24 to reach the LAN and the main router towards the internet. In order to allow traffic between clients on this foreign wireless network and the internet without changing the configuration of the main router, the Raspberry Pi can substitute the IP address of wireless clients with its own IP address on the LAN using a "masquerade" firewall rule.

The main router will see all outgoing traffic from wireless clients as coming from the Raspberry Pi, allowing communication with the internet.
The Raspberry Pi will receive all incoming traffic, substitute the IP addresses back, and forward traffic to the original wireless client.
This process is configured by adding a single firewall rule in the Raspberry Pi:

```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

Finally, save the new iptables configuration:

```
sudo apt-get install iptables-persistent
sudo sh -c "iptables-save > /etc/iptables/rules.v4"
```

### Configure the DHCP and DNS services for the wireless network

The DHCP and DNS services are provided by dnsmasq. The default configuration file serves as a template for all possible configuration options, whereas we only need a few. It is easier to start from an empty file.

Rename the default configuration file and edit a new one:

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo nano /etc/dnsmasq.conf
```

Add the following to the file and save it:

```
interface=wlan1 # Listening interface
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
                # Pool of IP addresses served via DHCP
domain=wlan     # Local wireless DNS domain
address=/gw.wlan/192.168.4.1
                # Alias for this router

dhcp-option=3,192.168.4.1
dhcp-option=6,192.168.4.1
server=8.8.8.8
no-dhcp-interface=
log-queries
log-dhcp
listen-address=127.0.0.1
```

The Raspberry Pi will deliver IP addresses between `192.168.4.2` and `192.168.4.20`, with a lease time of 24 hours, to wireless DHCP clients. You should be able to reach the Raspberry Pi under the name `gw.wlan` from wireless clients.

There are many more options for `dnsmasq`; see the default configuration file (`/etc/dnsmasq.conf`) or the online documentation for details.

### Configure the access point software

Create the hostapd configuration file, located at /etc/hostapd/hostapd.conf, to add the various parameters for your wireless network.

```
sudo nano /etc/hostapd/hostapd.conf
```

Add the information below to the configuration file. This configuration assumes we are using channel 7, with a network name of `NameOfNetwork`, and a password `AardvarkBadgerHedgehog`. The passphrase should be between 8 and 64 characters in length.

```
country_code=ES
interface=wlan1
ssid=NameOfNetwork
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
driver=nl80211
ieee80211n=1
wme_enabled=1
```

To use the 5 GHz band, you can change the operations mode from hw_mode=g to hw_mode=a. Possible values for hw_mode are:

a = IEEE 802.11a (5 GHz)
b = IEEE 802.11b (2.4 GHz)
g = IEEE 802.11g (2.4 GHz)
ad = IEEE 802.11ad (60 GHz)

### Reboot

```
sudo reboot
```

If SSH is enabled on the Raspberry Pi, it should be possible to connect to it from your wireless client as follows, assuming the pi account is present: ssh pi@192.168.4.1 or ssh pi@gw.wlan

[Source](https://www.raspberrypi.org/documentation/configuration/wireless/access-point-routed.md)
