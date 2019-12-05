interface JumpType {
	public: boolean,
	owner?: string,
	ownerGroup?: string
}

export default (jump: JumpType) => {
	if (jump.public)
		return 0;
	else if (jump.owner != null)
		return 1;
	else return 2;
}