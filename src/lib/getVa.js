function getVa (bank, response) {
  switch (bank) {
    case 'BNI':
      return response.va_numbers[0].va_number

    case 'Mandiri':
      return response.bill_key

    case 'BCA':
      return response.va_numbers[0].va_number

    case 'Permata':
      return response.permata_va_number

    default:
      return null
  }
}

export default getVa
