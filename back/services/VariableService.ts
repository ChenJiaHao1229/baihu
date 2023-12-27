export default interface VariableService {
  getVariable(search: PostSearchListType): Promise<PaginationType<VariableInfo>>
  getVariableList(): Promise<VariableInfo[]>
  getTagList(): Promise<EnvTagInfo[]>
  addTag(data: EnvTagInfo): Promise<EnvTagInfo>
  addVariable(data: VariableInfo): Promise<VariableInfo>
  updateVariable(data: VariableInfo): Promise<void>
  deleteVariable(id: string): Promise<void>
}
