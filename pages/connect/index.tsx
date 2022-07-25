import React from "react"
import Layout from "../../components/layout"
import { FaUserFriends } from "react-icons/fa"

const Connect = () => {
  return (
    <Layout>
      <div className="flex h-full w-full select-none items-center justify-center">
        <button className="mt-3 flex items-center justify-center rounded-md bg-soft-green py-1 px-4 text-white outline-none hover:bg-soft-green-dark">
          <FaUserFriends className="mr-2" />
          openRÖszTI
        </button>
      </div>
    </Layout>
  )
}

export default Connect
