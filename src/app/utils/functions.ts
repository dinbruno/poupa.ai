export function handleFirebaseError(errorCode: string | number) {
    const messages = {
      'auth/invalid-email': 'O endereço de email parece estar incorreto. Por favor, verifique e tente novamente.',
      'auth/user-disabled': 'Sua conta foi desativada. Por favor, contate o suporte para mais informações.',
      'auth/user-not-found': 'Não foi possível encontrar uma conta com este endereço de email. Você pode precisar se registrar primeiro.',
      'auth/wrong-password': 'Senha incorreta. Por favor, tente novamente ou redefina sua senha.',
      'auth/email-already-in-use': 'Este email já está sendo usado por outra conta.',
      'auth/weak-password': 'A senha fornecida é muito fraca. Por favor, escolha uma senha mais forte.',
      'auth/operation-not-allowed': 'Esta operação não está habilitada. Por favor, contate o suporte.',
      'auth/too-many-requests': 'Detectamos muitas solicitações sucessivas. Por favor, aguarde um pouco antes de tentar novamente.',
      'auth/network-request-failed': 'Um erro de rede ocorreu. Por favor, verifique sua conexão e tente novamente.',
      'auth/requires-recent-login': 'Esta operação é sensível e requer autenticação recente. Faça login novamente antes de tentar novamente.',
      'auth/invalid-verification-code': 'O código de verificação é inválido. Por favor, verifique e tente novamente.',
      'auth/invalid-verification-id': 'O ID de verificação é inválido. Por favor, verifique e tente novamente.',
      'auth/code-expired': 'O código de verificação expirou. Por favor, solicite um novo código.',
      'auth/missing-verification-code': 'Você não forneceu um código de verificação. Por favor, verifique e tente novamente.',
      'auth/missing-verification-id': 'Você não forneceu um ID de verificação. Por favor, verifique e tente novamente.',
      'auth/missing-email': 'Endereço de email incorreto ou inexistente. Por favor, verifique e tente novamente.',
      'too-many-requests': 'Detectamos muitas solicitações sucessivas. Por favor, aguarde um pouco antes de tentar novamente.',
      'network-request-failed': 'Um erro de rede ocorreu. Por favor, verifique sua conexão e tente novamente.',
      'too-many-attempts': 'Detectamos muitas tentativas de login. Por favor, aguarde um pouco antes de tentar novamente.',
      400: "Credenciais de login inválidas. Por favor, verifique e tente novamente."
    } as Record<string, string>;
  
    return messages[errorCode] || 'Ocorreu um erro ao acessar o serviço de autenticação. Por favor, tente novamente mais tarde.';
  }