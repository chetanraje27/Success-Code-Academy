# Success Code Academy Admin Guide

This guide is for staff members who update the website. No coding is required.

## Sign in

1. Start the backend with `npm run dev` inside `server/`.
2. Start the website with `npm run dev` inside `client/`.
3. Open `http://localhost:3000/admin/login`.
4. Sign in with the admin email and password provided by the website owner.

Admin sessions use a protected, HttpOnly browser cookie and expire
automatically.

## Two ways to update the website

### Visual website editor

Use this when you want to see the page while changing it.

1. In the dashboard, choose **Visual website editor**.
2. Editable text receives a subtle underline. Click or tap the text itself.
3. Enter the replacement text and choose **Save live**.
4. Use **Preview** in the bottom toolbar to hide the editing controls.

Text changes are stored as overrides. The original text remains in the
application and is never overwritten.

The red bin appears after a field has been customized. It means **restore the
original website text**, not permanently delete the original.

Collection sections such as banners, announcements, star students, and results
show a **Manage** button. Their dialog supports:

- adding a new item;
- editing an existing item;
- changing display order or visibility;
- uploading an image;
- deleting an item after confirmation.

### Admin dashboard

Use `http://localhost:3000/admin` for a central overview.

- **Banners:** homepage and results hero images.
- **Announcements:** the homepage update ticker.
- **Star students:** student achievement carousel.
- **Results:** topper result records.
- **Site settings:** phone, email, address, WhatsApp, and social links.
- **Enquiries & records:** student accounts, course enquiries, scholarship
  forms, and contact messages.

Both workflows use the same secure API and database records. A change made in a
visual collection dialog also appears in the dashboard.

## Safe editing habits

- Check spelling and phone numbers before saving.
- Use concise headings so mobile layouts remain readable.
- Upload JPG, PNG, WebP, or GIF images smaller than 5 MB.
- Use the visibility switch when content may be needed again; delete only when
  the record is no longer required.
- Preview the page on both desktop and mobile after larger changes.
- Change temporary admin passwords under **Admin → Site settings**.

## Troubleshooting

- If editing controls are missing, confirm you are signed in as an admin and
  choose **Edit Site** in the header.
- If content does not load, confirm both `client` and `server` development
  processes are running.
- If a session expires, sign in again. Unsaved form text will not be submitted.
- If an edit was a mistake, use the bin or **Restore original** action.
