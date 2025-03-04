declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCreateOutPaintingTaskResponse_ = {
    code?: number;
    data?: CreateOutPaintingTaskResponse;
    message?: string;
  };

  type BaseResponseGetOutPaintingTaskResponse_ = {
    code?: number;
    data?: GetOutPaintingTaskResponse;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListPictureVO_ = {
    code?: number;
    data?: PictureVO[];
    message?: string;
  };

  type BaseResponseListSoImageSearchDto_ = {
    code?: number;
    data?: SoImageSearchDto[];
    message?: string;
  };

  type BaseResponseListSpace_ = {
    code?: number;
    data?: Space[];
    message?: string;
  };

  type BaseResponseListSpaceCategoryAnalyzeVo_ = {
    code?: number;
    data?: SpaceCategoryAnalyzeVo[];
    message?: string;
  };

  type BaseResponseListSpaceLevel_ = {
    code?: number;
    data?: SpaceLevel[];
    message?: string;
  };

  type BaseResponseListSpaceSizeAnalyzeVo_ = {
    code?: number;
    data?: SpaceSizeAnalyzeVo[];
    message?: string;
  };

  type BaseResponseListSpaceTagAnalyzeVo_ = {
    code?: number;
    data?: SpaceTagAnalyzeVo[];
    message?: string;
  };

  type BaseResponseListSpaceUserAnalyzeVo_ = {
    code?: number;
    data?: SpaceUserAnalyzeVo[];
    message?: string;
  };

  type BaseResponseListSpaceUserVo_ = {
    code?: number;
    data?: SpaceUserVo[];
    message?: string;
  };

  type BaseResponseLoginUserVo_ = {
    code?: number;
    data?: LoginUserVo;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePagePicture_ = {
    code?: number;
    data?: PagePicture_;
    message?: string;
  };

  type BaseResponsePagePictureVO_ = {
    code?: number;
    data?: PagePictureVO_;
    message?: string;
  };

  type BaseResponsePageSpace_ = {
    code?: number;
    data?: PageSpace_;
    message?: string;
  };

  type BaseResponsePageSpaceVO_ = {
    code?: number;
    data?: PageSpaceVO_;
    message?: string;
  };

  type BaseResponsePageUserVo_ = {
    code?: number;
    data?: PageUserVo_;
    message?: string;
  };

  type BaseResponsePicture_ = {
    code?: number;
    data?: Picture;
    message?: string;
  };

  type BaseResponsePictureTagCategory_ = {
    code?: number;
    data?: PictureTagCategory;
    message?: string;
  };

  type BaseResponsePictureVO_ = {
    code?: number;
    data?: PictureVO;
    message?: string;
  };

  type BaseResponseSpace_ = {
    code?: number;
    data?: Space;
    message?: string;
  };

  type BaseResponseSpaceUsageAnalyzeVo_ = {
    code?: number;
    data?: SpaceUsageAnalyzeVo;
    message?: string;
  };

  type BaseResponseSpaceUser_ = {
    code?: number;
    data?: SpaceUser;
    message?: string;
  };

  type BaseResponseSpaceVO_ = {
    code?: number;
    data?: SpaceVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BatchEditePictureDto = {
    category?: string;
    nameRule?: string;
    pictureIdList?: number[];
    spaceId?: number;
    tags?: string[];
  };

  type CreateOutPaintingTaskResponse = {
    code?: string;
    message?: string;
    output?: Output;
    requestId?: string;
  };

  type CreatePictureOutPaintingTaskRequest = {
    parameters?: Parameters;
    pictureId?: number;
  };

  type DeleteDto = {
    id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type GetOutPaintingTaskResponse = {
    output?: Output1;
    requestId?: string;
  };

  type GetOutPaintingTaskUsingGETParams = {
    /** taskId */
    taskId: string;
  };

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getSpaceByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getSpaceVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVoByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserVo = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Output = {
    taskId?: string;
    taskStatus?: string;
  };

  type Output1 = {
    code?: string;
    endTime?: string;
    message?: string;
    outputImageUrl?: string;
    scheduledTime?: string;
    submitTime?: string;
    taskId?: string;
    taskMetrics?: TaskMetrics;
    taskStatus?: string;
  };

  type PagePicture_ = {
    current?: number;
    pages?: number;
    records?: Picture[];
    size?: number;
    total?: number;
  };

  type PagePictureVO_ = {
    current?: number;
    pages?: number;
    records?: PictureVO[];
    size?: number;
    total?: number;
  };

  type PageSpace_ = {
    current?: number;
    pages?: number;
    records?: Space[];
    size?: number;
    total?: number;
  };

  type PageSpaceVO_ = {
    current?: number;
    pages?: number;
    records?: SpaceVO[];
    size?: number;
    total?: number;
  };

  type PageUserVo_ = {
    current?: number;
    pages?: number;
    records?: UserVo[];
    size?: number;
    total?: number;
  };

  type Parameters = {
    addWatermark?: boolean;
    angle?: number;
    bestQuality?: boolean;
    bottomOffset?: number;
    leftOffset?: number;
    limitImageSize?: boolean;
    outputRatio?: string;
    rightOffset?: number;
    topOffset?: number;
    xScale?: number;
    yScale?: number;
  };

  type Picture = {
    category?: string;
    createTime?: string;
    editTime?: string;
    id?: number;
    introduction?: string;
    isDelete?: number;
    name?: string;
    picColor?: string;
    picFormat?: string;
    picHeight?: number;
    picScale?: number;
    picSize?: number;
    picWidth?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    spaceId?: number;
    tags?: string;
    thumbnailUrl?: string;
    updateTime?: string;
    url?: string;
    userId?: number;
  };

  type PictureEditDto = {
    category?: string;
    id?: number;
    introduction?: string;
    name?: string;
    tags?: string[];
  };

  type PictureQueryDto = {
    category?: string;
    current?: number;
    endEditTime?: string;
    id?: number;
    introduction?: string;
    name?: string;
    pageNum?: number;
    pageSize?: number;
    picFormat?: string;
    picHeight?: number;
    picScale?: number;
    picSize?: number;
    picWidth?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    spaceId?: number;
    spaceIdIsNull?: boolean;
    startEditTime?: string;
    tags?: string[];
    userId?: number;
  };

  type PictureReviewDto = {
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
  };

  type PictureTagCategory = {
    categories?: string[];
    tags?: string[];
  };

  type PictureUpdateDto = {
    category?: string;
    id?: number;
    introduction?: string;
    name?: string;
    spaceId?: number;
    tags?: string[];
  };

  type PictureUploadByBatchDto = {
    count?: number;
    namePrefix?: string;
    searchText?: string;
  };

  type PictureUploadDto = {
    fileUrl?: string;
    id?: number;
    picName?: string;
    spaceId?: number;
  };

  type PictureVO = {
    category?: string;
    createTime?: string;
    editTime?: string;
    id?: number;
    introduction?: string;
    name?: string;
    permissionList?: string[];
    picColor?: string;
    picFormat?: string;
    picHeight?: number;
    picScale?: number;
    picSize?: number;
    picWidth?: number;
    spaceId?: number;
    tags?: string[];
    thumbnailUrl?: string;
    updateTime?: string;
    url?: string;
    user?: UserVo;
    userId?: number;
  };

  type SearchPictureByColorDto = {
    picColor?: string;
    spaceId?: number;
  };

  type SearchPictureByPictureDto = {
    id?: number;
  };

  type SoImageSearchDto = {
    http?: string;
    https?: string;
    imgUrl?: string;
    imgkey?: string;
    title?: string;
  };

  type Space = {
    createTime?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    maxCount?: number;
    maxSize?: number;
    spaceLevel?: number;
    spaceName?: string;
    spaceType?: number;
    totalCount?: number;
    totalSize?: number;
    updateTime?: string;
    userId?: number;
  };

  type SpaceAddDto = {
    spaceLevel?: number;
    spaceName?: string;
    spaceType?: number;
  };

  type SpaceCategoryAnalyzeDto = {
    queryAll?: boolean;
    queryPublic?: boolean;
    spaceId?: number;
  };

  type SpaceCategoryAnalyzeVo = {
    category?: string;
    count?: number;
    totalSize?: number;
  };

  type SpaceEditDto = {
    id?: number;
    spaceName?: string;
  };

  type SpaceLevel = {
    maxCount?: number;
    maxSize?: number;
    text?: string;
    value?: number;
  };

  type SpaceQueryDto = {
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    spaceLevel?: number;
    spaceName?: string;
    spaceType?: number;
    userId?: number;
  };

  type SpaceRankAnalyzeDto = {
    topN?: number;
  };

  type SpaceSizeAnalyzeVo = {
    count?: number;
    sizeRange?: string;
  };

  type SpaceTagAnalyzeVo = {
    count?: number;
    tag?: string;
  };

  type SpaceUpdateDto = {
    id?: number;
    maxCount?: number;
    maxSize?: number;
    spaceLevel?: number;
    spaceName?: string;
  };

  type SpaceUsageAnalyzeDto = {
    queryAll?: boolean;
    queryPublic?: boolean;
    spaceId?: number;
  };

  type SpaceUsageAnalyzeVo = {
    countUsageRatio?: number;
    maxCount?: number;
    maxSize?: number;
    sizeUsageRatio?: number;
    usedCount?: number;
    usedSize?: number;
  };

  type SpaceUser = {
    createTime?: string;
    id?: number;
    spaceId?: number;
    spaceRole?: string;
    updateTime?: string;
    userId?: number;
  };

  type SpaceUserAddDto = {
    spaceId?: number;
    spaceRole?: number;
    userId?: number;
  };

  type SpaceUserAnalyzeDto = {
    queryAll?: boolean;
    queryPublic?: boolean;
    spaceId?: number;
    timeDimension?: string;
    userId?: number;
  };

  type SpaceUserAnalyzeVo = {
    count?: number;
    period?: string;
  };

  type SpaceUserEditDto = {
    id?: number;
    spaceId?: number;
    spaceRole?: string;
  };

  type SpaceUserQueryDto = {
    id?: number;
    spaceId?: number;
    spaceRole?: number;
    userId?: number;
  };

  type SpaceUserVo = {
    createTime?: string;
    id?: number;
    spaceId?: number;
    spaceRole?: string;
    spaceVo?: SpaceVO;
    updateTime?: string;
    userId?: number;
    userVo?: UserVo;
  };

  type SpaceVO = {
    createTime?: string;
    editTime?: string;
    id?: number;
    maxCount?: number;
    maxSize?: number;
    permissionList?: string[];
    spaceLevel?: number;
    spaceName?: string;
    spaceType?: number;
    totalCount?: number;
    totalSize?: number;
    updateTime?: string;
    user?: UserVo;
    userId?: number;
  };

  type TaskMetrics = {
    failed?: number;
    succeeded?: number;
    total?: number;
  };

  type testDownloadUsingGETParams = {
    /** filepath */
    filepath?: string;
  };

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string;
    id?: number;
    picName?: string;
    spaceId?: number;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddDto = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserLoginDto = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryDto = {
    current?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userAccount?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterDto = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateDto = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVo = {
    createTime?: string;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
