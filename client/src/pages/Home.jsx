export default function Home({ user }) {
    
    return (
        <div>
                <h3>Welcome, {user.name}!</h3>
                <p>Your personal content management system is ready for use.</p>
        </div>
    )
}