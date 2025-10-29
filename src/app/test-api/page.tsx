"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  provider?: string;
  model?: string;
  error?: string;
  status?: number;
  results?: {
    timestamp: string;
    environment: Record<string, any>;
    connection: Record<string, any>;
    test: Record<string, any>;
  };
  troubleshooting?: Record<string, string>;
}

export default function TestAPIPage() {
  const [testing, setTesting] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingPollinations, setTestingPollinations] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [geminiResult, setGeminiResult] = useState<TestResult | null>(null);
  const [pollinationsResult, setPollinationsResult] = useState<TestResult | null>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-deepseek");
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: "测试请求失败",
        error: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const runGeminiTest = async () => {
    setTestingGemini(true);
    setGeminiResult(null);

    try {
      const response = await fetch("/api/test-gemini");
      const data = await response.json();
      setGeminiResult(data);
    } catch (error: any) {
      setGeminiResult({
        success: false,
        message: "测试请求失败",
        error: error.message,
      });
    } finally {
      setTestingGemini(false);
    }
  };

  const runPollinationsTest = async () => {
    setTestingPollinations(true);
    setPollinationsResult(null);

    try {
      const response = await fetch("/api/test-pollinations");
      const data = await response.json();
      setPollinationsResult(data);
    } catch (error: any) {
      setPollinationsResult({
        success: false,
        message: "测试请求失败",
        error: error.message,
      });
    } finally {
      setTestingPollinations(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">API 连接测试</h1>
          <p className="text-muted-foreground">
            诊断 DeepSeek / OpenAI API 连接问题
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">人格生成 API</CardTitle>
              <CardDescription className="text-sm">
                DeepSeek / OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runTest}
                disabled={testing}
                size="lg"
                className="w-full"
                variant="default"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  "测试"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">图像生成 - Gemini</CardTitle>
              <CardDescription className="text-sm">
                Google Gemini Imagen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runGeminiTest}
                disabled={testingGemini}
                size="lg"
                className="w-full"
                variant="secondary"
              >
                {testingGemini ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  "测试"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-base">图像生成 - Pollinations 🆓</CardTitle>
              <CardDescription className="text-sm">
                免费无需 API Key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runPollinationsTest}
                disabled={testingPollinations}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {testingPollinations ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  "测试 🚀"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <>
            {/* Overall Result */}
            <Card className={result.success ? "border-green-500" : "border-red-500"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      测试通过
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      测试失败
                    </>
                  )}
                </CardTitle>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.provider && (
                  <div>
                    <strong>AI 提供商:</strong> {result.provider}
                  </div>
                )}
                {result.model && (
                  <div>
                    <strong>模型:</strong> {result.model}
                  </div>
                )}
                {result.error && (
                  <div className="text-red-500">
                    <strong>错误信息:</strong> {result.error}
                  </div>
                )}
                {result.status && (
                  <div className="text-red-500">
                    <strong>HTTP 状态码:</strong> {result.status}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environment Check */}
            {result.results?.environment && (
              <Card>
                <CardHeader>
                  <CardTitle>环境配置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(result.results.environment).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-semibold">
                          {typeof value === "boolean" ? (
                            value ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-red-500">✗</span>
                            )
                          ) : (
                            String(value)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Connection Status */}
            {result.results?.connection && (
              <Card>
                <CardHeader>
                  <CardTitle>连接状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(result.results.connection).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-semibold">
                          {typeof value === "boolean" ? (
                            value ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-red-500">✗</span>
                            )
                          ) : (
                            String(value)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Test Call Result */}
            {result.results?.test && (
              <Card>
                <CardHeader>
                  <CardTitle>API 调用测试</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(result.results.test).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-semibold pl-4 break-all">
                          {typeof value === "boolean" ? (
                            value ? (
                              <span className="text-green-500">✓ 成功</span>
                            ) : (
                              <span className="text-red-500">✗ 失败</span>
                            )
                          ) : (
                            String(value)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Troubleshooting */}
            {result.troubleshooting && result.status && (
              <Card className="border-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                    故障排除建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 rounded-lg">
                      <strong className="text-yellow-500">
                        HTTP {result.status}:
                      </strong>
                      <p className="mt-2">
                        {result.troubleshooting[String(result.status)]}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">推荐解决方案：</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.status === 503 && (
                          <>
                            <li>检查 DeepSeek API 服务状态</li>
                            <li>验证 API Key 是否有效及额度是否充足</li>
                            <li>尝试稍后重试</li>
                            <li>考虑切换到 OpenAI API</li>
                          </>
                        )}
                        {result.status === 401 && (
                          <>
                            <li>检查 .env.local 中的 API Key 是否正确</li>
                            <li>确认 API Key 未过期</li>
                            <li>重新生成新的 API Key</li>
                          </>
                        )}
                        {result.status === 429 && (
                          <>
                            <li>等待一段时间后重试</li>
                            <li>检查 API 使用限额</li>
                            <li>升级 API 套餐</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        📖 详细文档: 请查看项目根目录的 <code className="text-primary">API_TEST.md</code>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Gemini Test Results */}
        {geminiResult && (
          <>
            <Card className={geminiResult.success ? "border-green-500" : "border-red-500"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {geminiResult.success ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      Gemini 测试通过
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      Gemini 测试失败
                    </>
                  )}
                </CardTitle>
                <CardDescription>{geminiResult.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {geminiResult.error && (
                  <div className="text-red-500">
                    <strong>错误信息:</strong> {geminiResult.error}
                  </div>
                )}
                {geminiResult.status && (
                  <div className="text-red-500">
                    <strong>HTTP 状态码:</strong> {geminiResult.status}
                  </div>
                )}
                {geminiResult.results?.test && (
                  <div className="space-y-3">
                    {Object.entries(geminiResult.results.test).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <div className="space-y-1 text-sm font-mono">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey} className="flex justify-between gap-2">
                              <span className="text-muted-foreground">{subKey}:</span>
                              <span className="font-semibold text-right break-all">
                                {typeof subValue === "boolean" ? (
                                  subValue ? (
                                    <span className="text-green-500">✓</span>
                                  ) : (
                                    <span className="text-red-500">✗</span>
                                  )
                                ) : (
                                  String(subValue)
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {geminiResult.troubleshooting && geminiResult.status && (
              <Card className="border-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                    Gemini 故障排除建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 rounded-lg">
                      <strong className="text-yellow-500">
                        HTTP {geminiResult.status}:
                      </strong>
                      <p className="mt-2">
                        {geminiResult.troubleshooting[String(geminiResult.status)]}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">推荐解决方案：</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>验证 Google Gemini API Key 是否有效</li>
                        <li>检查 Imagen 4 是否在你的区域可用</li>
                        <li>如果 Imagen 不可用，系统会自动回退到 Replicate</li>
                        <li>查看终端日志获取更详细的错误信息</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Pollinations Test Results */}
        {pollinationsResult && (
          <>
            <Card className={pollinationsResult.success ? "border-green-500" : "border-red-500"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {pollinationsResult.success ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      Pollinations 测试通过 ✨
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      Pollinations 测试失败
                    </>
                  )}
                </CardTitle>
                <CardDescription>{pollinationsResult.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pollinationsResult.error && (
                  <div className="text-red-500">
                    <strong>错误信息:</strong> {pollinationsResult.error}
                  </div>
                )}
                
                {pollinationsResult.results?.test && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">测试结果</h4>
                      <div className="space-y-1 text-sm font-mono">
                        {Object.entries(pollinationsResult.results.test).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between gap-2">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-semibold text-right break-all">
                              {typeof value === "boolean" ? (
                                value ? (
                                  <span className="text-green-500">✓</span>
                                ) : (
                                  <span className="text-red-500">✗</span>
                                )
                              ) : key === "imageUrl" ? (
                                <a 
                                  href={String(value)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  查看生成的图像 🖼️
                                </a>
                              ) : (
                                String(value)
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pollinationsResult.results.test.imageUrl && (
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-2">预览</h4>
                        <img 
                          src={pollinationsResult.results.test.imageUrl} 
                          alt="Test generated image"
                          className="w-full max-w-md mx-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(pollinationsResult as any).advantages && (
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">优势</h4>
                    <ul className="space-y-1 text-sm">
                      {(pollinationsResult as any).advantages.map((adv: string, i: number) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(pollinationsResult as any).nextSteps && (
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">下一步</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(pollinationsResult as any).nextSteps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ol className="space-y-2">
              <li>
                确保 <code>.env.local</code> 文件中配置了正确的 API Key
              </li>
              <li>点击"开始测试"按钮运行诊断</li>
              <li>查看测试结果和详细日志</li>
              <li>如果测试失败，按照故障排除建议操作</li>
              <li>
                同时查看终端日志获取更详细的错误信息
              </li>
            </ol>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">当前配置:</p>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>人格生成:</strong> DeepSeek (deepseek-chat) / OpenAI (gpt-4o)
                </li>
                <li>
                  <strong>图像生成:</strong> Google Gemini Imagen 4
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

