import pandas as pd
import random

depression = [
    "I feel hopeless and tired",
    "Life feels meaningless",
    "I hate myself",
    "I feel empty inside",
    "Nothing makes me happy",
    "I feel broken",
    "I feel lost",
    "I feel worthless",
    "I feel lonely",
    "I regret everything"
]

anxiety = [
    "I am very anxious",
    "I feel nervous",
    "My heart is racing",
    "I cannot relax",
    "I am scared of failing",
    "I feel worried",
    "I feel panic",
    "I overthink everything",
    "I feel tense",
    "I feel uneasy"
]

stress = [
    "I have too much work",
    "I feel pressure",
    "I am exhausted from work",
    "I am overloaded with tasks",
    "Deadlines are stressing me",
    "I cannot handle workload",
    "I feel burned out",
    "I am mentally tired",
    "I feel drained",
    "I have too many responsibilities"
]

happy = [
    "I feel amazing today",
    "I am very happy",
    "I feel excited",
    "Today was wonderful",
    "I enjoyed my day",
    "I feel confident",
    "I achieved my goal",
    "I feel proud",
    "I feel joyful",
    "Life is beautiful"
]

neutral = [
    "Today was normal",
    "I went to college",
    "I completed homework",
    "I watched a movie",
    "I had dinner",
    "I went shopping",
    "I attended class",
    "I cleaned my room",
    "I studied",
    "I traveled by bus"
]

data = []

for _ in range(60):
    data.append([random.choice(depression), "Depression"])
    data.append([random.choice(anxiety), "Anxiety"])
    data.append([random.choice(stress), "Stress"])
    data.append([random.choice(happy), "Happy"])
    data.append([random.choice(neutral), "Neutral"])

df = pd.DataFrame(data, columns=["text", "label"])
df.to_csv("instagram_mental_health_dataset.csv", index=False)

print("Dataset created successfully with", len(df), "rows!")