import webbrowser
from cloudflare_error_page import render as render_cf_error_page

# This function renders an error page based on the input parameters
error_page = render_cf_error_page({
    "html_title": "itsccao.github.io | 404: Page Not Found",
    "title": "Page Not Found",
    "error_code": "404",
    "more_information":
    {
        "hidden": False,
        "text": "developer.mozilla.org",
        "link": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status",
        "for": "more information"
    },
    "browser_status": {
        "status": "ok",
        "location": "",
        "name": "",
        "status_text": "Seems Working"
    },
    "cloudflare_status": {
        "status": "ok",
        "location": "White and fluffy pillows on the sky",
        "name": "Cloud",
        "status_text": "Often Working"
    },
    "host_status": {
        "status": "ok",
        "location": "itsccao.github.io",
        "name": "",
        "status_text": "Almost Working"
    },
    # can be 'browser', 'cloudflare', or 'host'
    "error_source": "host",
    "what_happened": "This page doesn&rsquo;t exist. The site is running fine - you&rsquo;ve just hit a wrong or outdated link.",
    "what_can_i_do": "Double-check the link, head back to the homepage, or try searching for what you were looking for.",
    "perf_sec_by":
    {
            "text": "GitHub",
            "link": "https://docs.github.com/en/pages"
    },
    "ray_id": "0123456789abcdef",
    "client_ip": "127.0.0.0"
})

with open('error.html', 'w') as f:
    f.write(error_page)

#webbrowser.open('error.html')