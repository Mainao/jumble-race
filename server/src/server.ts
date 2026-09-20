import { httpServer } from "./io";
import { registerSocketHandlers } from "./socketHandlers";

registerSocketHandlers();

httpServer.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});
