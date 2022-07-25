import type { NextPage } from "next"
import { useRouter } from "next/router"
import { SyntheticEvent, useState } from "react"
import Layout from "../components/layout"
import Spinner from "../components/spinner/spinner"
import { useROszTIClient } from "roszti-client"

const Home: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userCode, setUserCode] = useState("")
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")
  const ROszTI = useROszTIClient(process.env.NEXT_PUBLIC_API_URL || "")

  const { o: origin } = router.query

  const onFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    try {
      if (email.length > 0 && password.length > 0) {
        setFetching(true)
        const token = await (
          await ROszTI.getToken({ email, password })
        ).access_token
        const user = await ROszTI.getCurrentUser({ token })
        if (!user.id) throw new Error("Invalid credentials")
        if (user) {
          router.push({
            pathname: "/user",
            query: {
              c: user.code,
            },
          })
        }
      } else if (userCode.length === 5 || userCode.length === 6) {
        setFetching(true)
        router.push({
          pathname: "/user",
          query: {
            c: userCode,
          },
        })
      }
    } catch (err) {
      setError("Something went wrong.")
      setFetching(false)
    }
  }

  return (
    <Layout>
      {fetching ? (
        <Spinner />
      ) : (
        <div className="flex h-full w-full select-none items-center justify-center">
          <form
            onSubmit={(e) => onFormSubmit(e)}
            action=""
            className="flex flex-col items-center space-y-3 text-sm"
          >
            <p className="mb-1 text-4xl font-semibold flex flex-col">
              RÖszTI
              <span className="ml-auto text-sm font-normal -mt-2 text-soft-green">
                connect
              </span>
            </p>
            <div className="relative flex w-full flex-col bg-white">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                type="email"
                className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none mb-3"
                placeholder="E-mail"
              />
              <div className="">
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  type="password"
                  className="w-full bg-gray-100 rounded-md py-1 px-3 outline-none"
                  placeholder="Password"
                />
                {error && (
                  <p className="mt-1 pl-1 text-xs text-rose-500">{error}</p>
                )}
              </div>
              <button className="mt-3 w-full rounded-md bg-soft-green py-1 px-3 text-white outline-none">
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

export default Home
