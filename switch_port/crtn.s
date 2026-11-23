	.section .init
	.align 2
	ldp	x29, x30, [sp], #16
	ret

	.section .fini
	.align 2
	ldp	x29, x30, [sp], #16
	ret

	.section .note.GNU-stack,"",%progbits
