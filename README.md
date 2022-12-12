## FireSMS API

Sending SMS

### NodeJS Docs

```bash
npm install axios
```

```javascript
import axios from "axios";

asycn function sendSMS(to: string, message: string) {
	const response = await axios.post("/firesms.co/api/", {
		headers: {"Content-Type"},
 		data: {to, message}
	})
}
```
