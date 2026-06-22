# Cold Email & LinkedIn DM Writer

AI-powered tool to generate personalized cold emails and LinkedIn DMs that get replies.

---

## ⚡ Deploy to Vercel — Step by Step

### Step 1: Get an Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Click **API Keys** in the sidebar
4. Click **Create Key**, give it a name, and copy it
5. Keep this key — you'll need it in Step 4

---

### Step 2: Push Code to GitHub

1. Create a new repo on [https://github.com/new](https://github.com/new)
   - Name it: `cold-email-writer`
   - Set to **Private** or Public
   - Do NOT add README or .gitignore (the project already has them)

2. Open your terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cold-email-writer.git
git push -u origin main
```

---

### Step 3: Import to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in (free account is fine)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `cold-email-writer` repo
5. Keep all settings as default — Vercel auto-detects Next.js
6. **Don't deploy yet** — proceed to Step 4 first

---

### Step 4: Add Your API Key as an Environment Variable

Still on the Vercel import page, scroll down to **"Environment Variables"**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (your key from Step 1) |

Add it and then click **"Deploy"**

---

### Step 5: Update Your Name & Email

Before or after deploying, open `pages/index.js` and find this section near the bottom:

```jsx
<strong style={{ margin: "0 4px" }}>Your Full Name</strong>
<a href="mailto:your@email.com" style={styles.footerEmail}>your@email.com</a>
```

Replace with your actual name and email, then push the change:

```bash
git add pages/index.js
git commit -m "Add name and email"
git push
```

Vercel will auto-redeploy within ~30 seconds.

---

### Step 6: Your App is Live! 🎉

After deployment, Vercel gives you a URL like:
```
https://cold-email-writer-xyz.vercel.app
```

That's your live URL — share it!

---

## Local Development

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

- ✉ **Cold Email generator** — subject line + body, under 150 words
- 💼 **LinkedIn DM generator** — short, human, under 400 characters  
- 5 tone options: Professional, Friendly, Casual, Bold & Direct, Warm & Empathetic
- Copy to clipboard with one click
- Regenerate with the same inputs
- Fully mobile responsive
