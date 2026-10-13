# digilocksmith.com Shopify theme

The storefront theme for digilocksmith.com, a shop that copies building key fobs, key cards and parking tags. It is built on Shopify's [Dawn](https://github.com/Shopify/dawn) theme (see `DAWN-README.md` and `LICENSE.md`).

## What this theme adds to Dawn

| Feature | Files |
| --- | --- |
| Required key photo, copy route (serial number, mail-in, local visit), serial number and ZIP fields, authorization checkbox on every product tagged `clone-service`. Values are saved on the order as line item properties. | `snippets/clone-order-fields.liquid`, `assets/clone-order.js`, `assets/clone-order.css`, `snippets/buy-buttons.liquid`, `assets/product-form.js` |
| Local service page with a ZIP check and a visit request form | `sections/local-service.liquid`, `templates/page.local-service.json` |
| Bulk order page: contact details, open text box, and a slot for a file-upload app block | `sections/bulk-order-form.liquid`, `templates/page.bulk-order.json` |
| Home page: hero, how it works, tag types, bulk call-out, FAQ | `templates/index.json` |
| Theme settings > Clone service: local ZIP prefixes, home ZIP, radius text, max photo size | `config/settings_schema.json` |

"Buy it now" buttons are turned off on clone products because they skip the required fields.

## Store setup

1. **Connect this repo.** Online Store > Themes > Add theme > Connect from GitHub, pick this repo and the `main` branch.
2. **Products.** Create one product per tag type (for example "Low-frequency fob or card copy"). Price it per tag, add a Format option (Fob, Card, Sticker) if you like, and add the tag `clone-service`. Uncheck "Track quantity".
3. **Pages.** Create a page called "Local service" with handle `local-service` and template `page.local-service`, and a page called "Bulk orders" with handle `bulk-orders` and template `page.bulk-order`. Add both to the main menu.
4. **Local area.** Theme settings > Clone service > Local service ZIP prefixes. The default (`900-918, 920, 921, 923-928, 930`) roughly covers 100 miles around 92704; check it against the area you really serve.
5. **Mail-in instructions.** Settings > Notifications > Order confirmation: add a block that prints your mailing address when an item's `Copy method` is `Mail in my key` (example below).
6. **Bulk photo uploads.** Shopify's contact form cannot take files. Install a form app with file upload and add its app block to the Bulk order form section; until then the page asks customers to email photos to the store email.
7. **Chat.** Install Shopify Inbox (free) for the chat bubble on every page and turn on its automated answers.
8. **Domain.** Settings > Domains > Connect existing domain > digilocksmith.com.

Order confirmation snippet for step 5:

```liquid
{% for line in line_items %}
  {% if line.properties['Copy method'] == 'Mail in my key' %}
    <p><strong>Mail your key to:</strong><br>
    digilocksmith, Order {{ order_name }}<br>
    YOUR STREET ADDRESS<br>
    SANTA ANA, CA 92704</p>
    {% break %}
  {% endif %}
{% endfor %}
```

## Checking changes

```sh
npx @shopify/cli@3 theme check --path .
npx @shopify/cli@3 theme dev --store YOUR-STORE.myshopify.com
```
