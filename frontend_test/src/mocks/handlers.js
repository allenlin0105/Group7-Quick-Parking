import { rest } from "msw";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

export const handlers = [
  rest.post(`${baseURL}/login`, async (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            status: 200,
            message: "Success",
            token: "random-token"
        })
    );
  }),

  rest.post(`${baseURL}/space_info`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "utilities": [
            {
                "date": "2023-12-03",
                "utility": 0
            },
            {
                "date": "2023-12-04",
                "utility": 0
            },
            {
                "date": "2023-12-05",
                "utility": 0
            },
            {
                "date": "2023-12-06",
                "utility": 0
            },
            {
                "date": "2023-12-07",
                "utility": 0
            },
            {
                "date": "2023-12-08",
                "utility": 0
            },
            {
                "date": "2023-12-09",
                "utility": 0
            }
        ],
        "usage_list": [
            {
                "_id": {},
                "parking_lot_id": 0,
                "space_id": 4,
                "plate": "23456",
                "start_time": "2023-12-12T23:17:07.413+08:00",
                "end_time": null
            }
        ]
    })
    );
  }),

  rest.post(`${baseURL}/usage_rate`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
            "hour": 23,
            "usage_rate": 50
        },
        {
            "hour": 22,
            "usage_rate": 40
        },
        {
            "hour": 21,
            "usage_rate": 30
        },
        {
            "hour": 20,
            "usage_rate": 20
        },
        {
            "hour": 19,
            "usage_rate": 10
        },
        {
            "hour": 18,
            "usage_rate": 0
        },
        {
            "hour": 17,
            "usage_rate": 10
        },
        {
            "hour": 16,
            "usage_rate": 20
        },
        {
            "hour": 15,
            "usage_rate": 30
        },
        {
            "hour": 14,
            "usage_rate": 40
        },
        {
            "hour": 13,
            "usage_rate": 50
        },
        {
            "hour": 12,
            "usage_rate": 60
        },
        {
            "hour": 11,
            "usage_rate": 70
        },
        {
            "hour": 10,
            "usage_rate": 80
        },
        {
            "hour": 9,
            "usage_rate": 90
        },
        {
            "hour": 8,
            "usage_rate": 80
        },
        {
            "hour": 7,
            "usage_rate": 70
        },
        {
            "hour": 6,
            "usage_rate": 60
        },
        {
            "hour": 5,
            "usage_rate": 50
        },
        {
            "hour": 4,
            "usage_rate": 40
        },
        {
            "hour": 3,
            "usage_rate": 30
        },
        {
            "hour": 2,
            "usage_rate": 20
        },
        {
            "hour": 1,
            "usage_rate": 10
        },
        {
            "hour": 0,
            "usage_rate": 0
        }
    ])
    );
  }),

  rest.get(`${baseURL}/available_space`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "total_space": 5,
        "n_available_space": 2,
        "space_list": [
            1,
            3
        ]
    })
    );
  }),

  rest.post(`${baseURL}/find_car`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "space_id": 4,
        "start_time": "2023-12-12T23:17:07.319+08:00"
    })
    );
  })
];