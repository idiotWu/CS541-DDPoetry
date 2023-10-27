# Data-Driven Poetry

This repo contains code for the Data-Driven Poetry in [CS 541 - Information Visualization](https://emilywall.github.io/vis/index.html) class at Emory University.

Please check [https://idiotwu.github.io/CS541-DDPoetry/](https://idiotwu.github.io/CS541-DDPoetry/) for the production build.

## Modifications Since M3

I realized that each category is calculated independently and is not a part of the whole, so stacked bar chart may not be suitable in my case. Therefore, I changed the design to an interactive globe where you can hover over a certain country to see details. The color of each country is determined by the maximum gap in all wealth groups, e.g., for data

| Wealth Level | Primary Completion Rate |
| ------------ | ----------------------- |
| Poorest      | 0.1                     |
| Poor         | 0.3                     |
| Middle       | 0.7                     |
| Rich         | 0.9                     |
| Richest      | 1.0                     |

The largest gap is `Richest - Poorest = 0.9`. Greater gaps will be rendered in red colors and smaller gaps will be in greens.

Currently, I only visualized one indicator "primary completion rate" in this milestone. I will create a selection menu to switch between different indicators in the next milestone.

## Local Development Setup

1. Install node.js (18 or 20): https://nodejs.org/en/download
2. Clone this repository and `cd` to the root
3. Install dependencies using
   ```bash
   npm install
   ```
4. Start a local server using
   ```bash
   npm run dev
   ```
5. Visit http://localhost:5173 for development build.

## Feature Plans

- [ ] Indicator selection dropdown
- [ ] Year range selector
- [ ] Bar chart/line chart switcher
- [ ] Scrollytelling poetry
