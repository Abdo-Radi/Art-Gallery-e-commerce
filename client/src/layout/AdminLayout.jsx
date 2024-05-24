import Sidebar from "../components/admin/Sidebar"
import Header from "../components/admin/Header"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {    
    return (
        <div className="flex h-screen dark:bg-boxdark-2 dark:text-bodydark">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar />
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className=" flex w-full flex-col overflow-y-auto overflow-x-hidden">
                {/* <!-- ===== Header Start ===== --> */}
                <Header />
                {/* <!-- ===== Header End ===== --> */}

                {/* <!-- ===== Main Content Start ===== --> */}
                <main>
                    <div className="mx-auto p-4 md:p-6 2xl:p-10">
                        <Outlet />
                    </div>
                </main>
                {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
        </div>
    )
}

export default AdminLayout