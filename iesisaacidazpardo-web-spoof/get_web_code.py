from scrapy import Selector
import requests
from tqdm import tqdm


full_url = 'http://www.edu.xunta.gal/centros/iesisaacdiazpardo/'
base_url = 'http://www.edu.xunta.gal'

output_dir = 'output'


def output_file(path, content):
    import os
    import errno

    filename = output_dir + '/' + path

    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    with open(filename, "w") as f:
        f.write(content)


def get_html(url):
    return requests.get(full_url).text


def get_sources_links(html):

    links = []

    css_links = Selector(text=html).xpath('//link/@href').getall()
    js_links = Selector(text=html).xpath('//script/@src').getall()
    img_links = Selector(text=html).xpath('//img/@src').getall()

    links.extend(css_links)
    links.extend(js_links)
    links.extend(img_links)

    return links


def save_html(html):
    import json
    json_html = json.dumps({'html': html})

    output_file('./index.html', html)
    output_file('./index.html.json', json_html)


def parse_links(links):
    parsed_links = []

    for link in links:
        if(link[:5] == 'data:'):
            continue

        if (link[:7] != 'http://'):
            parsed_links.append(base_url + link)

        else:
            parsed_links.append(link)

    return parsed_links


def save_sources(source_links):
    for link in tqdm(source_links):
        try:
            source = requests.get(link).text

            _, path = link.split(base_url)

            path = path.split('?')[0]

            output_file(f'./{path}', source)

        except Exception as e:
            print(e)


html = get_html(base_url)
save_html(html)

unparsed_links = get_sources_links(html)
links = parse_links(unparsed_links)

save_sources(links)
