import type { NextPage } from "next"
import { useRouter } from "next/router"
import { SyntheticEvent, useEffect, useState } from "react"
import Layout from "../components/layout"
import Spinner from "../components/spinner/spinner"
import { useROszTIClient } from "roszti-client"
import { BsFillShieldLockFill } from "react-icons/bs"

const Home: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fetching, setFetching] = useState(false)
  const [origin, setOrigin] = useState("")
  const [error, setError] = useState("")
  const ROszTI = useROszTIClient(process.env.NEXT_PUBLIC_API_URL || "")

  const { o } = router.query

  useEffect(() => {
    if (o) {
      setOrigin(Array.isArray(o) ? o[0] : o)
    }
  }, [o, router.isReady])

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
          //TODO: Create a solution for this.
          // if (origin) {
          //   router.push({
          //     pathname: "https://open.roszti.barnabee.studio/user",
          //     query: { c: user.code },
          //   })
          // }
          // else {
          //   router.push({ pathname: "/connect", query: "test" })
          // }

          router.push({
            pathname: "https://open.roszti.barnabee.studio/user",
            query: { c: user.code },
          })
        }
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
            <div className="mb-2 flex flex-col text-4xl font-semibold">
              <p className="flex items-center">
                <BsFillShieldLockFill className="mr-1 text-3xl text-soft-green " />
                RÖszTI
              </p>
              <span className="ml-auto -mt-2 text-sm font-normal text-soft-green">
                connect
              </span>
            </div>
            <div className="relative flex w-full flex-col">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                type="email"
                className="mb-3 w-full rounded-md bg-gray-100 py-1 px-3 outline-none dark:bg-gray-700"
                placeholder="E-mail"
              />
              <div className="">
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  type="password"
                  className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none dark:bg-gray-700"
                  placeholder="Password"
                />
                {error && (
                  <p className="mt-1 pl-1 text-xs text-rose-500">{error}</p>
                )}
              </div>
              <button className="mt-3 w-full rounded-md bg-soft-green py-1 px-3 text-white outline-none hover:bg-soft-green-dark">
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
