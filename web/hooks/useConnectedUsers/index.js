import { useState } from 'react';
import axios from 'axios';

export function useConnectedUsers() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);

	const getData = () => {
		axios
			.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`)
			.then((res) => {
				setData(res.data);
			})
			.catch(() => {
				setError(true);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return [{ loading, error, data }, getData];
}
