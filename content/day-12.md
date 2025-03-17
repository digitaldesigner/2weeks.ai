# Fact-Checking
<div class="tag"><span class="level-3">Advanced</span></div>

By now, you might be wondering “Is AI always right?” or “Can I trust the answers I’m getting?”. Both excellent questions, and the short answer is **no** — AI is not always correct.

AI processes vast amounts of data, making predictions and assumptions based on what you provide. While that makes it a powerful tool, it also means AI can sometimes generate misleading, outdated, or even entirely incorrect information. Unlike a search engine, it doesn’t directly pull from a single verified source — it pulls information from a variety of sources, then attempts to make sense of it based on it’s training algorithms. Simply... it’s complex, and it can lead to errors.

Today, we’ll dig into how to tell if AI is actually giving you the right information. We’ll cover how to check its answers for accuracy, get it to back up its claims with evidence and examples, and use citations and cross-referencing to fact-check anything that seems questionable. The goal isn’t just to take AI’s responses at face value but to learn how to challenge them and make sure they hold up!

## Trusting AI
Think of AI like a well-meaning friend: It gives answers confidently, but that doesn’t always mean it’s right. If something feels *off*, trust your instincts and verify the information. Luckily, AI can also help double-check itself — if you know how to ask the right questions.

Here’s how to ensure accuracy when using AI:

### Ask AI to Show Its Work
Just like a good teacher would expect from a student, you can ask AI to provide sources, examples, or reasoning behind its answers. Try asking:

> Can you provide sources for that?

You could also ask *“What’s your reasoning behind this answer?”*, or even *“Are you sure?”*. This type of prompt often results in AI showing sources, which appear as small badges next to paragraphs `1` and a button at the bottom of the response `2`

<picture>
  <source srcset="./assets/images/fake-news-dark.png" media="(prefers-color-scheme:dark)">
  <img class="lazyload" data-src="./assets/images/fake-news.png" />
</picture>

Clicking on the sources badge reveals what AI used to form its answer, helping you judge how reliable the information really is:

<picture>
  <source srcset="./assets/images/sources-panel-dark.png" media="(prefers-color-scheme:dark)">
  <img class="lazyload" data-src="./assets/images/sources-panel.png" />
</picture>

For peace of mind, ChatGPT generally pulls from reputable sources—government websites, educational institutions, mainstream news organizations, scientific and academic journals, and specialized resources for certain topics, like Investopedia for finance or historical archives for historical queries. 

```
Even trusted sources can have biases or outdated information, so it’s always worth verifying key facts yourself.
```

### Use Effective Prompting
The way you ask a question also affects the accuracy of the response. Broad or vague questions lead to broad and vague answers. For fact-checking, be precise in your wording and request specific types of evidence, such as:

- 📗 **Historical Data**: “What do historical records say about this?”
- 🧑‍🔬 **Scientific Findings**: “Are there peer-reviewed studies supporting this?”
- 📈 **Statistics**: “Can you provide data from a reliable source?”

As an example, instead of *“Tell me about climate change.”* — which is very broad — you could try:

> Summarize the key findings from the most recent IPCC climate report and include sources.

*** 

## Using AI for Fact-Checking
Now that we’ve covered how to fact-check AI, let’s flip it around and use AI to fact-check other sources — like the news. 

In a world where headlines are engineered for clicks, news is reduced to soundbites, and major media outlets often lean into specific narratives, separating fact from “fake news” can feel overwhelming. AI can help cut through the noise by prioritizing accuracy, credibility, and neutrality. Here’s how:

### 🔍 Compare Headlines Across Sources
If you read a news article from one outlet, AI can help you see how *other* sources are reporting on the same story:

> Can you summarize multiple perspectives on recent reports about {{event}}

This helps reveal media bias and gives you a clearer picture of the facts behind the headlines. You can also paste an entire article and ask:

> List the facts from this article, and provide credible sources to support or refute them: {{paste article}}

### 🎭 Identify Deepfakes & Fake Quotes
Misinformation spreads fast, especially when it comes to misattributed quotes or fake videos. AI can check whether a public figure actually said something and provide the full context. Here’s a surprising example:

> Did Kanye West really say “I am a Nazi”? If so, what’s the context?

This allows you to form your own opinion based on facts rather than relying solely on news outlets or viral posts.

***

By leveraging AI’s neutrality and its ability to analyze multiple sources simultaneously, you can use it as a powerful fact-checking tool — not to **replace** your own critical thinking, but to **enhance** it.

Ultimately, the more you question and verify... the more useful AI becomes!

<div class="open-prompt"><span>Read</span><span class="time">4 min</span></div>