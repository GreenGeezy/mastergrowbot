import { Navigate } from 'react-router-dom';
// Preserve existing buyer access; do not accept new paid guide orders.
export default function PlaybookCheckout() { return <Navigate to="/playbooks" replace/>; }
