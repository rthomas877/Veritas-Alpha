import plotly.graph_objects as go
import random

categories = ['A', 'B', 'C', 'D']
values = [random.randint(-50, 100) for _ in range(4)]

# Assign colors based on positive (green) or negative/zero (red)
colors = ['green' if val > 0 else 'red' for val in values]

fig = go.Figure(data=[go.Bar(x=categories, y=values, marker_color=colors)])

fig.update_layout(
    title='Random 4-Bar Bar Chart with Positive (Green) and Negative (Red) Bars',
    xaxis_title='Category',
    yaxis_title='Value',
    yaxis=dict(range=[min(values) - 10, max(values) + 10])
)

fig.show()
