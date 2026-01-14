export default function Info({ user, setShowInfoState }) {
    return (
        <div>
            <button onClick={() => setShowInfoState(false)}>X</button>
            <h2>Info</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>address:</p>
            <p>street: {user.address.street}</p>
            <p>city: {user.address.city}</p>
            <p>number: {user.address.number}</p>
            <p>company:</p>
            <p>name: {user.company.name}</p>
            <p>catchPhrase: {user.company.catchPhrase}</p>
            <p>bs: {user.company.bs}</p>
        </div>
    )
}