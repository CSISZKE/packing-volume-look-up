window.compatibilityData = (function () {
  const COEFFICIENTS = {
  "crossfire3": {
    "A": 1.0,
    "B": 0
  },
  "jfx2": {
    "A": 0.86,
    "B": 30
  },
  "leia": {
    "A": 1.3535,
    "B": 1
  },
  "petra": {
    "A": 1.8464,
    "B": -12
  },
  "safire4": {
    "A": 0.64,
    "B": 47
  }
};

  function generateSizes(min, max, increment = 1) {
    const sizes = [];
    for (let size = min; size <= max; size += increment) {
      sizes.push(String(size));
    }
    return sizes;
  }

  const CANOPY_SIZES = {
  "crossfire3": generateSizes(89, 159, 10),
  "jfx2": generateSizes(69, 119, 1),
  "leia": generateSizes(60, 100, 1),
  "petra": generateSizes(55, 90, 1),
  "safire4": generateSizes(109, 189, 10)
};

  const IDEAL_C3_BY_CONTAINER = {
  "sunpath": {
    "DNKY": 109,
    "I2": 104,
    "I3": 123,
    "I4": 154,
    "I5": 146,
    "J1KS": 139,
    "J2K": 139,
    "J3K": 156,
    "J4K": 94,
    "J5K": 170,
    "NJK": 116,
    "OJK": 130,
    "RSK": 97,
    "RSK-1": 126,
    "RSK.5": 102,
    "TJNK": 124
  },
  "upt": {
    "V303": 95,
    "V304": 103,
    "V306": 110,
    "V308": 118,
    "V309": 132,
    "V310": 129,
    "V314": 97,
    "V316": 105,
    "V319": 119,
    "V320": 139,
    "V326": 109,
    "V343": 124,
    "V344": 129,
    "V347": 150,
    "V348": 148,
    "V349": 149
  }
};

  const STATIC_COMPATIBILITY_DATA = {
  "air": {
    "sunpath": {
      "209": {
        "comfortable": [
          "J4.5K"
        ],
        "loose": [
          "J5K"
        ],
        "tight": [
          "J4K"
        ]
      },
      "229": {
        "comfortable": [
          "J4.5K",
          "J5K"
        ],
        "loose": [
          "J6NK"
        ],
        "tight": []
      },
      "249": {
        "comfortable": [
          "J5K",
          "J6NK"
        ],
        "loose": [
          "J7NK"
        ],
        "tight": [
          "J4.5K"
        ]
      },
      "269": {
        "comfortable": [
          "J5K",
          "J6NK",
          "J7NK"
        ],
        "loose": [
          "J8K"
        ],
        "tight": []
      }
    },
    "upt": {
      "209": {
        "comfortable": [
          "V389",
          "V355",
          "V346-1",
          "V358",
          "V390",
          "V364",
          "V380",
          "V360",
          "V392"
        ],
        "loose": [
          "V360-1",
          "V375",
          "V364-1",
          "V382"
        ],
        "tight": [
          "V354",
          "V353",
          "V357",
          "V346"
        ]
      },
      "229": {
        "comfortable": [
          "V346-1",
          "V358",
          "V390",
          "V364",
          "V380",
          "V360",
          "V392",
          "V360-1",
          "V375",
          "V364-1",
          "V382"
        ],
        "loose": [
          "V392-2",
          "V362",
          "V360-2",
          "V378"
        ],
        "tight": [
          "V389",
          "V355"
        ]
      },
      "249": {
        "comfortable": [
          "V360",
          "V392",
          "V360-1",
          "V375",
          "V364-1",
          "V382",
          "V392-2"
        ],
        "loose": [
          "V362",
          "V360-2",
          "V378",
          "V361"
        ],
        "tight": [
          "V355",
          "V346-1",
          "V358",
          "V390",
          "V364",
          "V380"
        ]
      },
      "269": {
        "comfortable": [
          "V360-1",
          "V375",
          "V364-1",
          "V382",
          "V392-2",
          "V362",
          "V360-2",
          "V378",
          "V361"
        ],
        "loose": [
          "V360-3"
        ],
        "tight": [
          "V360",
          "V392"
        ]
      }
    }
  }
};

  function classifyFit(c3eq, ideal) {
    const goodMin = ideal * 0.92;
    const goodMax = ideal * 1.08;
    const accMin = ideal * 0.83;
    const accMax = ideal * 1.17;

    if (c3eq >= goodMin && c3eq <= goodMax) {
      return 'comfortable';
    }

    if (c3eq >= accMin && c3eq <= accMax) {
      return c3eq < goodMin ? 'tight' : 'loose';
    }

    return null;
  }

  function buildCompatibilityData() {
    const data = JSON.parse(JSON.stringify(STATIC_COMPATIBILITY_DATA));

    Object.keys(COEFFICIENTS).forEach((canopyType) => {
      const { A, B } = COEFFICIENTS[canopyType];
      const sizes = CANOPY_SIZES[canopyType] || [];

      data[canopyType] = {};

      Object.keys(IDEAL_C3_BY_CONTAINER).forEach((brand) => {
        const containerIdeal = IDEAL_C3_BY_CONTAINER[brand];
        data[canopyType][brand] = {};

        sizes.forEach((size) => {
          const sizeValue = Number(size);
          const c3eq = A * sizeValue + B;
          const buckets = { tight: [], comfortable: [], loose: [] };

          Object.keys(containerIdeal).forEach((containerSize) => {
            const ideal = containerIdeal[containerSize];
            const fit = classifyFit(c3eq, ideal);
            if (fit) {
              buckets[fit].push(containerSize);
            }
          });

          data[canopyType][brand][String(sizeValue)] = buckets;
        });
      });
    });

    return data;
  }

  return buildCompatibilityData();
})();
