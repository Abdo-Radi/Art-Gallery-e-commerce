import { useSelector } from "react-redux"

const Header = () => {
    const { user } = useSelector(state => state.user)

    return user && (
        <header className="sticky top-0 z-999 px-6 py-2 flex justify-end items-center gap-3 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <p>{user.firstName} {user.lastName}</p>
            <span className="bg-bodydark1 flex items-center justify-center text-black h-12 w-12 rounded-full">
                {user.firstName.charAt(0).toUpperCase()}
            </span>
        </header>
    )
}

export default Header