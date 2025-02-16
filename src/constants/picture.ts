export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_REVIEW_STATUS_MAPPING = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAPPING).map(key => {
  return {
    label: PIC_REVIEW_STATUS_MAPPING[key],
    value: key,
  }
})
