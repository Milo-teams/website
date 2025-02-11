import { socket } from "../pages/_app";

const emitEvent = (
  eventName: string,
  data: any,
  callback?: (data: any, error: any) => void
) => {
  try {
    socket.on(eventName, (data: any) => {
      if (data.status === "success") {
        if (callback) callback(data);
      } else {
        if (callback) callback(null, data.message);
      }
    });

    socket.emit(eventName, data, callback);
  } catch (error) {
    return null;
  }
};

export default emitEvent;
