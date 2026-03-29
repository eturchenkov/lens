import type { NextApiRequest, NextApiResponse } from "next"
import { lens, Input } from "@/pages/api/lens"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ text: string }>,
) {
  if (req.method == "POST") {
    const { input }: { input: Input } = req.body
    const result = await lens(input, JSON.stringify(users))
    res.status(201).json({ text: result })
  }
}

const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 28,
    city: "New York",
    occupation: "Software Engineer",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    age: 35,
    city: "Los Angeles",
    occupation: "Product Manager",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol.williams@example.com",
    age: 31,
    city: "Chicago",
    occupation: "Data Scientist",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.brown@example.com",
    age: 42,
    city: "Houston",
    occupation: "Business Analyst",
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    age: 26,
    city: "Phoenix",
    occupation: "UX Designer",
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank.miller@example.com",
    age: 39,
    city: "Philadelphia",
    occupation: "DevOps Engineer",
  },
  {
    id: 7,
    name: "Grace Wilson",
    email: "grace.wilson@example.com",
    age: 29,
    city: "San Antonio",
    occupation: "Frontend Developer",
  },
  {
    id: 8,
    name: "Henry Moore",
    email: "henry.moore@example.com",
    age: 45,
    city: "San Diego",
    occupation: "CTO",
  },
  {
    id: 9,
    name: "Ivy Taylor",
    email: "ivy.taylor@example.com",
    age: 27,
    city: "Dallas",
    occupation: "QA Engineer",
  },
  {
    id: 10,
    name: "Jack Anderson",
    email: "jack.anderson@example.com",
    age: 33,
    city: "San Jose",
    occupation: "Backend Developer",
  },
]
