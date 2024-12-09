
/**
 * Downloads an Excel file from a given response.
 *
 * @param response - The response data to be converted into a Blob and downloaded.
 * @param fileName - The desired name of the downloaded file.
 *
 * This function creates a Blob from the response data, generates a URL for the Blob,
 * and triggers a download of the file with the specified name. The downloaded file
 * name includes the current date and time in the format `YYYY.MM.DD HH:MM:SS`.
 */
export default function downloadExcelFile(
  response: any,
  fileName: string
) {
  const blob = new Blob([response], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date();
  const formattedDate = `${date.getFullYear()}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
  a.download = `${formattedDate} ${fileName}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);

  return;
}
