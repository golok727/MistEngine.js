# Mist Logger

Mist logger is a printf style logger

# Format

| flag |        meaning         | example |
| ---- | :--------------------: | ------- |
| %s   |      text to log       |         |
| %n   |      Logger Name       |         |
| %Y   |    Year in 4 digits    |         |
| %y   |    Year in 2 digits    |         |
| %m   | Month in number (1-12) |         |
| %M   |     Month in text      |         |
| %D   |  Short MM/DD/YY date   |         |
| %w   |    week-day in 1-6     |         |
| %L   |     Emoji of level     |         |
| %l   |     Level in text      |         |
| %p   |  current performance   |         |

## Usage

```ts
const logger = new MistLogger()

logger.log('{0}', {name: 'Radha'}) // Out => App: {"name":"Radha"} [ 1/18/2024 ]
// use : for pretty print objects
logger.log('\n{:0}\n', {name: 'Radha'})
/*
  Output 
  App: 
  {
    "name": "Radha"
  }
  [ 1/18/2024 ]
*/
logger.log('{0}-{1}-{2}', 1, 2, 3)
```

### RoadMap

- Add colors
